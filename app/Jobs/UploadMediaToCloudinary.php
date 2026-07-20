<?php

namespace App\Jobs;

use App\Services\CloudinaryService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UploadMediaToCloudinary implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 300;

    /**
     * Storage-relative paths of temporary files to upload.
     * Raw UploadedFile objects are NOT serializable — callers must
     * store the files to local disk and pass the resulting paths here.
     */
    protected array $storagePaths;

    protected string $folder;

    protected int $modelId;

    protected string $modelType;

    /**
     * @param  array   $storagePaths  Paths relative to the default filesystem disk
     *                                (e.g. "tmp/images/abc123.jpg")
     * @param  string  $folder        Cloudinary folder to upload into
     * @param  int     $modelId       ID of the model to attach images to
     * @param  string  $modelType     Short model name, e.g. "Product", "Food", "Service"
     */
    public function __construct(
        array $storagePaths,
        string $folder,
        int $modelId,
        string $modelType
    ) {
        $this->storagePaths = $storagePaths;
        $this->folder       = $folder;
        $this->modelId      = $modelId;
        $this->modelType    = $modelType;
    }

    public function handle(CloudinaryService $cloudinary): void
    {
        $modelClass = "App\\Models\\{$this->modelType}";
        $model      = $modelClass::find($this->modelId);

        if (! $model) {
            Log::warning("UploadMediaToCloudinary: {$this->modelType} #{$this->modelId} not found.");
            $this->cleanupTempFiles();
            return;
        }

        // Resolve absolute paths from storage-relative paths
        $absolutePaths = [];
        foreach ($this->storagePaths as $path) {
            if (Storage::exists($path)) {
                $absolutePaths[] = Storage::path($path);
            } else {
                Log::warning("UploadMediaToCloudinary: temp file not found: {$path}");
            }
        }

        if (empty($absolutePaths)) {
            Log::warning("UploadMediaToCloudinary: no temp files found for {$this->modelType} #{$this->modelId}");
            return;
        }

        try {
            // Upload to Cloudinary — returns array of URL strings
            $uploadedUrls = $cloudinary->uploadMany($absolutePaths, $this->folder);

            // Merge with any existing images (already stored as URL strings)
            $existingImages = $model->images ?? [];
            $model->update([
                'images' => array_values(array_merge($existingImages, $uploadedUrls)),
            ]);

            Log::info(
                count($uploadedUrls) .
                " image(s) uploaded for {$this->modelType} #{$this->modelId}"
            );
        } catch (\Throwable $e) {
            Log::error("Cloudinary upload failed for {$this->modelType} #{$this->modelId}: " . $e->getMessage());
            throw $e; // Triggers retry
        } finally {
            $this->cleanupTempFiles();
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error(
            "UploadMediaToCloudinary job permanently failed for " .
            "{$this->modelType} #{$this->modelId}: " .
            $exception->getMessage()
        );
        $this->cleanupTempFiles();
    }

    private function cleanupTempFiles(): void
    {
        foreach ($this->storagePaths as $path) {
            if (Storage::exists($path)) {
                Storage::delete($path);
            }
        }
    }
}