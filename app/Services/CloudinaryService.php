<?php

namespace App\Services;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    public function __construct()
    {
        Configuration::instance(config('cloudinary.cloud_url'));
    }

    private array $defaultOptions = [
        'transformation' => [
            [
                'quality'      => 'auto',
                'fetch_format' => 'auto',
            ],
        ],
    ];

    /**
     * Upload a single file and return its secure URL.
     *
     * @param  UploadedFile|string  $file   UploadedFile instance or absolute path
     * @param  string               $folder  Cloudinary folder
     * @param  array                $options Additional Cloudinary options
     * @return string  The Cloudinary secure URL
     */
    public function upload(
        UploadedFile|string $file,
        string $folder,
        array $options = []
    ): string {
        $options = array_merge(
            $this->defaultOptions,
            ['folder' => $folder],
            $options
        );

        $path = $file instanceof UploadedFile
            ? $file->getRealPath()
            : $file;

        $result = (new UploadApi())->upload($path, $options);

        return (string) $result['secure_url'];
    }

    /**
     * Upload multiple files and return an array of secure URLs.
     *
     * @param  array   $files    Array of UploadedFile instances or absolute paths
     * @param  string  $folder   Cloudinary folder
     * @param  array   $options  Additional Cloudinary options
     * @return string[]  Array of secure URLs
     */
    public function uploadMany(
        array $files,
        string $folder,
        array $options = []
    ): array {
        $urls = [];

        foreach ($files as $file) {
            try {
                $urls[] = $this->upload($file, $folder, $options);
            } catch (\Throwable $e) {
                Log::error('CloudinaryService::uploadMany — single file failed: ' . $e->getMessage());
                // Continue uploading remaining files
            }
        }

        return $urls;
    }

    /**
     * Delete a file from Cloudinary by its public_id.
     */
    public function delete(string $publicId): bool
    {
        try {
            $result = (new UploadApi())->destroy($publicId);
            return ($result['result'] ?? '') === 'ok';
        } catch (\Throwable $e) {
            Log::error('CloudinaryService::delete failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete multiple files by their public_ids.
     */
    public function deleteMany(array $publicIds): void
    {
        foreach ($publicIds as $publicId) {
            $this->delete($publicId);
        }
    }

    /**
     * Extract the Cloudinary public_id from a secure URL.
     * e.g. https://res.cloudinary.com/cloud/image/upload/v123/folder/filename.jpg
     *      => "folder/filename"
     */
    public function publicIdFromUrl(string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH);

        // Strip everything up to and including /upload/v12345/
        $path = preg_replace('#^.*?/upload/(?:v\d+/)?#', '', $path);

        return trim(
            pathinfo($path, PATHINFO_DIRNAME) . '/' . pathinfo($path, PATHINFO_FILENAME),
            '/'
        );
    }

    /**
     * Store uploaded files to temporary local storage and return
     * storage-relative paths. Use this before dispatching
     * UploadMediaToCloudinary jobs so the files survive serialisation.
     *
     * @param  UploadedFile[]  $files
     * @return string[]  Storage-relative paths
     */
    public static function storeTemporary(array $files): array
    {
        $paths = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                // Store in local disk under tmp/media/
                $paths[] = $file->store('tmp/media', 'local');
            }
        }

        return array_filter($paths); // Remove any false values
    }
}