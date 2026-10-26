import type { ContentEditorProps } from './OverviewPage';
import { ContentEditor } from './OverviewPage';

type ContentFormPageProps = ContentEditorProps & {
  onBack: () => void;
};

export default function ContentFormPage({ onBack, ...props }: ContentFormPageProps) {
  return (
    <div className="mx-auto min-h-[calc(100vh-58px)] max-w-[1200px] p-[22px] md:p-[34px]">
      <button className="mb-4 text-xs font-bold text-[#777283] hover:text-[#d92867]" onClick={onBack} type="button">
        ← Back to Content Studio
      </button>
      <div>
        <p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">CONTENT STUDIO</p>
        <h1 className="text-[27px] font-bold tracking-[-.04em]">{props.initialContent ? 'Edit content' : 'Create new content'}</h1>
        <p className="mt-2 text-[13px] leading-6 text-[#777283]">Fill in the details below. Your content will be saved in the database.</p>
      </div>
      <ContentEditor {...props} showTabs={false} />
    </div>
  );
}
