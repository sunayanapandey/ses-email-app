import React from 'react';
import Button from './Button';
import { Mail, Plus, Trash2, Save, ArrowRight, Download } from 'lucide-react';

const ButtonExamples = () => {
    return (
        <div className="p-8 bg-surface-10 min-h-screen space-y-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-h1 text-surface-900 mb-2">Button Design System</h1>
                <p className="text-body text-surface-600 mb-8">
                    Interactive overview of all button variants, states, and sizes.
                </p>

                {/* Primary Buttons */}
                <section className="bg-white p-6 rounded-xl border border-surface-200 mb-6">
                    <h2 className="text-h3 text-surface-900 mb-4">Primary Buttons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="primary">Default</Button>
                        <Button variant="primary" icon={Plus}>With Icon</Button>
                        <Button variant="primary" icon={ArrowRight} iconPosition="right">Right Icon</Button>
                        <Button variant="primary" isLoading>Loading</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                    </div>
                </section>

                {/* Secondary Buttons */}
                <section className="bg-white p-6 rounded-xl border border-surface-200 mb-6">
                    <h2 className="text-h3 text-surface-900 mb-4">Secondary Buttons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="secondary">Default</Button>
                        <Button variant="secondary" icon={Save}>With Icon</Button>
                        <Button variant="secondary" isLoading>Loading</Button>
                        <Button variant="secondary" disabled>Disabled</Button>
                    </div>
                </section>

                {/* Dashed Buttons */}
                <section className="bg-white p-6 rounded-xl border border-surface-200 mb-6">
                    <h2 className="text-h3 text-surface-900 mb-4">Dashed Buttons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="dashed">Default</Button>
                        <Button variant="dashed" icon={Plus}>Add Item</Button>
                        <Button variant="dashed" isLoading>Loading</Button>
                        <Button variant="dashed" disabled>Disabled</Button>
                    </div>
                </section>

                {/* Link Buttons */}
                <section className="bg-white p-6 rounded-xl border border-surface-200 mb-6">
                    <h2 className="text-h3 text-surface-900 mb-4">Link Buttons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="link">Default Link</Button>
                        <Button variant="link" icon={ArrowRight} iconPosition="right">View Details</Button>
                        <Button variant="link" disabled>Disabled Link</Button>
                    </div>
                </section>

                {/* Ghost Buttons */}
                <section className="bg-white p-6 rounded-xl border border-surface-200 mb-6">
                    <h2 className="text-h3 text-surface-900 mb-4">Ghost Buttons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="ghost">Default Ghost</Button>
                        <Button variant="ghost" icon={Mail}>With Icon</Button>
                        <Button variant="ghost" disabled>Disabled</Button>
                    </div>
                </section>

                {/* Destructive Buttons */}
                <section className="bg-white p-6 rounded-xl border border-surface-200 mb-6">
                    <h2 className="text-h3 text-surface-900 mb-4">Destructive Buttons</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="destructive">Delete</Button>
                        <Button variant="destructive" icon={Trash2}>Delete Item</Button>
                        <Button variant="destructive" isLoading>Deleting...</Button>
                        <Button variant="destructive" disabled>Disabled</Button>
                    </div>
                </section>

                {/* Sizes */}
                <section className="bg-white p-6 rounded-xl border border-surface-200 mb-6">
                    <h2 className="text-h3 text-surface-900 mb-4">Sizes</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button size="sm" variant="primary">Small</Button>
                        <Button size="md" variant="primary">Medium (Default)</Button>
                        <Button size="lg" variant="primary">Large</Button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ButtonExamples;
