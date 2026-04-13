import React, { forwardRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Editor = forwardRef(({ defaultValue, onChange, onSelectionChange }, ref) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['clean']
        ],
    };

    return (
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-2xl overflow-hidden min-h-[900px] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group/editor">
            <ReactQuill 
                ref={ref}
                theme="snow"
                defaultValue={defaultValue}
                onChange={onChange}
                onChangeSelection={onSelectionChange}
                placeholder="Start writing your thoughts and let your creativity flow..."
                modules={modules}
            />
            <style>{`
                .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    padding: 12px 20px !important;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .ql-formats {
                    margin-right: 12px !important;
                    padding-right: 12px !important;
                    border-right: 1px solid #f3f4f6 !important;
                    display: flex !important;
                    align-items: center !important;
                }
                .ql-formats:last-child {
                    border-right: none !important;
                }
                .ql-snow.ql-toolbar button {
                    border-radius: 6px !important;
                    transition: all 0.2s !important;
                    width: 32px !important;
                    height: 32px !important;
                    display: flex !important;
                    items-center !important;
                    justify-center !important;
                }
                .ql-snow.ql-toolbar button:hover {
                    background: #f3f4f6 !important;
                    color: #4f46e5 !important;
                }
                .ql-snow.ql-toolbar button.ql-active {
                    color: #4f46e5 !important;
                    background: #eef2ff !important;
                }
                .ql-editor {
                    padding: 60px 80px !important;
                    font-size: 1.15rem !important;
                    line-height: 1.8 !important;
                    color: #1f2937 !important;
                }
                .ql-editor.ql-blank::before {
                    color: #9ca3af !important;
                    font-style: normal !important;
                    left: 80px !important;
                    font-weight: 500 !important;
                }
                .ql-container {
                    font-family: 'Inter', sans-serif !important;
                    border: none !important;
                }
            `}</style>
        </div>
    );
});

export default Editor;
