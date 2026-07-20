import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function HomepageEdit({ sections }) {
    const { data, setData, put, processing, errors } = useForm({
        sections: sections.map(sec => ({
            id: sec.id,
            section_name: sec.section_name,
            content: sec.content || {},
            is_active: !!sec.is_active,
            sort_order: sec.sort_order || 0,
        }))
    });

    const handleContentChange = (index, key, value) => {
        const updated = [...data.sections];
        updated[index].content[key] = value;
        setData('sections', updated);
    };

    const handleSlideChange = (sectionIndex, slideIndex, key, value) => {
        const updated = [...data.sections];
        const slides = [...(updated[sectionIndex].content.slides || [])];
        slides[slideIndex][key] = value;
        updated[sectionIndex].content.slides = slides;
        setData('sections', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/admin/homepage', { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Admin - Homepage Settings" />

            <div className="mb-8 rounded-3xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur">
                <h1 className="text-3xl font-semibold text-gray-900">Homepage Content Editor</h1>
                <p className="mt-2 text-sm text-gray-500">Configure and manage active carousel slides, banner text, and grid sort orders.</p>
            </div>

                <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">
                    {data.sections.map((section, secIdx) => (
                        <div key={section.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                            <div className="flex justify-between items-center border-b pb-3 mb-4">
                                <h3 className="font-bold text-lg text-brand-dark uppercase tracking-wider">{section.section_name} Section</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox"
                                            id={`active-${section.id}`}
                                            checked={section.is_active}
                                            onChange={e => {
                                                const updated = [...data.sections];
                                                updated[secIdx].is_active = e.target.checked;
                                                setData('sections', updated);
                                            }}
                                            className="h-4.5 w-4.5 text-brand-brown focus:ring-brand-gold border-gray-300 rounded"
                                        />
                                        <label htmlFor={`active-${section.id}`} className="ml-2 text-sm font-bold text-gray-700">Enabled</label>
                                    </div>
                                    <input 
                                        type="number"
                                        value={section.sort_order}
                                        onChange={e => {
                                            const updated = [...data.sections];
                                            updated[secIdx].sort_order = parseInt(e.target.value) || 0;
                                            setData('sections', updated);
                                        }}
                                        className="w-16 text-center border-gray-300 rounded-lg text-sm"
                                        placeholder="Order"
                                    />
                                </div>
                            </div>

                            {/* Dynamic Content Forms */}
                            {section.section_name === 'hero' && section.content.slides && (
                                <div className="space-y-6">
                                    <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Configure Hero Carousel Slides</h4>
                                    {section.content.slides.map((slide, sldIdx) => (
                                        <div key={sldIdx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                            <div className="font-bold text-xs text-brand-brown">Slide #{sldIdx + 1}</div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Slide Image URL</label>
                                                    <input 
                                                        type="text"
                                                        value={slide.image || ''}
                                                        onChange={e => handleSlideChange(secIdx, sldIdx, 'image', e.target.value)}
                                                        className="w-full border-gray-300 rounded-lg text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Headline Text</label>
                                                    <input 
                                                        type="text"
                                                        value={slide.title || ''}
                                                        onChange={e => handleSlideChange(secIdx, sldIdx, 'title', e.target.value)}
                                                        className="w-full border-gray-300 rounded-lg text-xs"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle Text</label>
                                                    <input 
                                                        type="text"
                                                        value={slide.subtitle || ''}
                                                        onChange={e => handleSlideChange(secIdx, sldIdx, 'subtitle', e.target.value)}
                                                        className="w-full border-gray-300 rounded-lg text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Button Redirect Path</label>
                                                    <input 
                                                        type="text"
                                                        value={slide.link || ''}
                                                        onChange={e => handleSlideChange(secIdx, sldIdx, 'link', e.target.value)}
                                                        className="w-full border-gray-300 rounded-lg text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {section.section_name !== 'hero' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Header Title</label>
                                        <input 
                                            type="text"
                                            value={section.content.title || ''}
                                            onChange={e => handleContentChange(secIdx, 'title', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Sub-Header Text</label>
                                        <textarea 
                                            value={section.content.subtitle || ''}
                                            onChange={e => handleContentChange(secIdx, 'subtitle', e.target.value)}
                                            className="w-full border-gray-300 rounded-lg text-sm"
                                            rows="2"
                                        ></textarea>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-full bg-brand-brown hover:bg-brand-dark text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-md disabled:opacity-50"
                    >
                        {processing ? 'Saving Settings...' : 'Save Homepage Layout'}
                    </button>
                </form>
        </AdminLayout>
    );
}
