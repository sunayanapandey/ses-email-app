import React from 'react';

/**
 * Typography Examples Component
 * Demonstrates all typography styles from the design system
 */
const TypographyExamples = () => {
    return (
        <div className="p-8 bg-surface-10 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Headings Section */}
                <section className="bg-white p-6 rounded-xl border border-surface-200">
                    <h2 className="text-h2 text-surface-900 mb-6">Heading Styles</h2>

                    <div className="space-y-4">
                        <div>
                            <span className="text-caption text-surface-500 block mb-1">H1 / Title Extra Large</span>
                            <h1 className="text-h1 text-surface-900">
                                The quick brown fox jumps
                            </h1>
                        </div>

                        <div>
                            <span className="text-caption text-surface-500 block mb-1">H2 / Title Large</span>
                            <h2 className="text-h2 text-surface-800">
                                The quick brown fox jumps over the lazy dog
                            </h2>
                        </div>

                        <div>
                            <span className="text-caption text-surface-500 block mb-1">H3 / Title</span>
                            <h3 className="text-h3 text-surface-800">
                                The quick brown fox jumps over the lazy dog
                            </h3>
                        </div>

                        <div>
                            <span className="text-caption text-surface-500 block mb-1">H4 / Label Large</span>
                            <h4 className="text-h4 text-surface-900">
                                The quick brown fox jumps over the lazy dog
                            </h4>
                        </div>

                        <div>
                            <span className="text-caption text-surface-500 block mb-1">H5 / Label</span>
                            <h5 className="text-h5 text-surface-700">
                                The quick brown fox jumps over the lazy dog
                            </h5>
                        </div>

                        <div>
                            <span className="text-caption text-surface-500 block mb-1">H6 / Label Small</span>
                            <h6 className="text-h6 text-surface-700">
                                The quick brown fox jumps over the lazy dog
                            </h6>
                        </div>
                    </div>
                </section>

                {/* Body Text Section */}
                <section className="bg-white p-6 rounded-xl border border-surface-200">
                    <h2 className="text-h2 text-surface-900 mb-6">Body Text Styles</h2>

                    <div className="space-y-4">
                        <div>
                            <span className="text-caption text-surface-500 block mb-1">Large Body (16px Light)</span>
                            <p className="text-body-large text-surface-800">
                                The quick brown fox jumps over the lazy dog. This is the larger body text used for emphasis or important paragraphs that need more visual weight.
                            </p>
                        </div>

                        <div>
                            <span className="text-caption text-surface-500 block mb-1">Paragraph / Body (14px Light)</span>
                            <p className="text-body text-surface-700">
                                The quick brown fox jumps over the lazy dog. This is the standard body text used for most content. It's lightweight and optimized for readability in longer passages.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Caption Styles Section */}
                <section className="bg-white p-6 rounded-xl border border-surface-200">
                    <h2 className="text-h2 text-surface-900 mb-6">Caption Styles</h2>

                    <div className="space-y-4">
                        <div>
                            <span className="text-caption text-surface-500 block mb-1">Caption Medium (12px Medium)</span>
                            <span className="text-caption-medium text-surface-700 block">
                                The quick brown fox jumps over the lazy dog
                            </span>
                        </div>

                        <div>
                            <span className="text-caption text-surface-500 block mb-1">Caption (12px Regular)</span>
                            <span className="text-caption text-surface-600 block">
                                The quick brown fox jumps over the lazy dog
                            </span>
                        </div>
                    </div>
                </section>

                {/* Color Combinations Section */}
                <section className="bg-white p-6 rounded-xl border border-surface-200">
                    <h2 className="text-h2 text-surface-900 mb-6">Typography with Colors</h2>

                    <div className="space-y-4">
                        <div className="bg-primary-50 p-4 rounded-lg">
                            <h3 className="text-h3 text-primary-500 mb-2">Primary Heading</h3>
                            <p className="text-body text-primary-700">Body text in primary color</p>
                        </div>

                        <div className="bg-error-50 p-4 rounded-lg">
                            <h4 className="text-h4 text-error-700 mb-2">Error Message</h4>
                            <p className="text-body text-error-600">Something went wrong. Please try again.</p>
                        </div>

                        <div className="bg-success-50 p-4 rounded-lg">
                            <h4 className="text-h4 text-success-700 mb-2">Success!</h4>
                            <p className="text-body text-success-600">Your changes have been saved successfully.</p>
                        </div>

                        <div className="bg-warning-50 p-4 rounded-lg">
                            <h4 className="text-h4 text-warning-700 mb-2">Warning</h4>
                            <p className="text-body text-warning-700">Please review before proceeding.</p>
                        </div>
                    </div>
                </section>

                {/* Real-World Example */}
                <section className="bg-white p-6 rounded-xl border border-surface-200">
                    <h2 className="text-h2 text-surface-900 mb-4">Real-World Card Example</h2>

                    <div className="bg-surface-10 p-6 rounded-lg border border-surface-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-h3 text-surface-900 mb-1">Email Campaign Stats</h3>
                                <p className="text-body text-surface-600">Track your campaign performance</p>
                            </div>
                            <span className="text-caption text-surface-500">Updated 2h ago</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <span className="text-h1 text-primary-500 block">1,234</span>
                                <span className="text-caption text-surface-600">Sent</span>
                            </div>
                            <div>
                                <span className="text-h1 text-success-500 block">856</span>
                                <span className="text-caption text-surface-600">Opened</span>
                            </div>
                            <div>
                                <span className="text-h1 text-secondary-500 block">324</span>
                                <span className="text-caption text-surface-600">Clicked</span>
                            </div>
                        </div>

                        <button className="text-h5 bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-lg w-full transition-colors">
                            View Details
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default TypographyExamples;
