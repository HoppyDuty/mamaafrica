<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageContent;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomepageController extends Controller
{
    public function edit()
    {
        $sections = HomepageContent::orderBy('sort_order')->get();
        return Inertia::render('Admin/Homepage/Edit', ['sections' => $sections]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'sections'               => 'required|array',
            'sections.*.id'         => 'required|exists:homepage_content,id',
            'sections.*.content'    => 'required|array',
            'sections.*.is_active'  => 'boolean',
            'sections.*.sort_order' => 'integer',
        ]);

        foreach ($validated['sections'] as $sectionData) {
            HomepageContent::find($sectionData['id'])->update([
                'content'    => $sectionData['content'],
                'is_active'  => $sectionData['is_active'] ?? true,
                'sort_order' => $sectionData['sort_order'] ?? 0,
            ]);
        }

        // Bust homepage cache immediately
        CacheService::clearHomepage();

        return back()->with('success', 'Homepage updated.');
    }
}
