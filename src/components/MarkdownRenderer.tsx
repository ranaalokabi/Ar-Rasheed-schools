import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Strip out internal tags like [OFFICIAL_FEES_SCHEDULE_IMAGE] from the text flow
  const cleanContent = content.replace(/\[OFFICIAL_FEES_SCHEDULE_IMAGE\]/gi, '').trim();

  // Split content by table blocks or regular paragraphs
  const blocks = splitIntoBlocks(cleanContent);

  return (
    <div className="space-y-2.5 leading-relaxed text-[clamp(0.8125rem,2.5vw,0.9375rem)]">
      {blocks.map((block, idx) => {
        if (block.type === 'table') {
          return <TableBlock key={idx} tableMarkdown={block.content} />;
        }
        return <TextBlock key={idx} text={block.content} />;
      })}
    </div>
  );
};

interface Block {
  type: 'text' | 'table';
  content: string;
}

function splitIntoBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.split('\n');
  let currentTextBlock: string[] = [];
  let currentTableBlock: string[] = [];
  let inTable = false;

  for (const line of lines) {
    const isTableRow = line.trim().startsWith('|') && line.trim().endsWith('|');

    if (isTableRow) {
      if (!inTable) {
        if (currentTextBlock.length > 0) {
          blocks.push({ type: 'text', content: currentTextBlock.join('\n') });
          currentTextBlock = [];
        }
        inTable = true;
      }
      currentTableBlock.push(line);
    } else {
      if (inTable) {
        blocks.push({ type: 'table', content: currentTableBlock.join('\n') });
        currentTableBlock = [];
        inTable = false;
      }
      currentTextBlock.push(line);
    }
  }

  if (inTable && currentTableBlock.length > 0) {
    blocks.push({ type: 'table', content: currentTableBlock.join('\n') });
  } else if (currentTextBlock.length > 0) {
    blocks.push({ type: 'text', content: currentTextBlock.join('\n') });
  }

  return blocks;
}

const TableBlock: React.FC<{ tableMarkdown: string }> = ({ tableMarkdown }) => {
  const rows = tableMarkdown
    .split('\n')
    .map((r) => r.trim())
    .filter(Boolean);

  if (rows.length < 2) return null;

  // Header row
  const headerCells = rows[0]
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());

  // Data rows (skip index 1 which is separator |---|---|)
  const dataRows = rows.slice(2).map((row) =>
    row
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())
  );

  return (
    <div className="my-2.5 overflow-x-auto rounded-xl border border-[#dedad0] bg-[#fbfaf7] shadow-2xs">
      <table className="w-full text-[clamp(0.725rem,2.1vw,0.85rem)] text-right border-collapse">
        <thead>
          <tr className="bg-[#f0eee8] border-b border-[#dedad0] text-[#1e5d4e]">
            {headerCells.map((header, hIdx) => (
              <th
                key={hIdx}
                className="px-2.5 py-2 font-bold tracking-wide whitespace-nowrap"
              >
                <FormatInlineText text={header} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#dedad0]/60 text-[#242b27]">
          {dataRows.map((cells, rIdx) => (
            <tr
              key={rIdx}
              className="hover:bg-[#f5f3ed] transition-colors odd:bg-white even:bg-[#faf9f6]"
            >
              {cells.map((cell, cIdx) => (
                <td key={cIdx} className="px-2.5 py-2 whitespace-nowrap">
                  <FormatInlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TextBlock: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n\n');

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 mr-1">
                    <span className="text-[#1b7f6c] font-bold text-sm mt-0.5 flex-shrink-0">•</span>
                    <span className="flex-1">
                      <FormatInlineText text={trimmed.substring(2)} />
                    </span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 mr-1">
                    <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#1b7f6c]/15 text-[#1b7f6c] font-bold text-[10px] sm:text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#1b7f6c]/30">
                      {numMatch[1]}
                    </span>
                    <span className="flex-1">
                      <FormatInlineText text={numMatch[2]} />
                    </span>
                  </div>
                );
              }

              // Headers
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="font-bold text-[#1e5d4e] text-[clamp(0.875rem,2.8vw,1.05rem)] mt-2 mb-1">
                    <FormatInlineText text={trimmed.replace(/^###\s+/, '')} />
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="font-extrabold text-[#11362b] text-[clamp(0.95rem,3.2vw,1.2rem)] mt-2 mb-1">
                    <FormatInlineText text={trimmed.replace(/^##\s+/, '')} />
                  </h3>
                );
              }

              return (
                <p key={lIdx}>
                  <FormatInlineText text={trimmed} />
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

// Inline bold, links, and URL formatting
const FormatInlineText: React.FC<{ text: string }> = ({ text }) => {
  const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  const parts = text.split(tokenRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        // Check if markdown link [text](url)
        const mdLinkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
        if (mdLinkMatch) {
          const [, label, url] = mdLinkMatch;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#006967] underline decoration-[#006967]/60 underline-offset-2 hover:text-[#004e4c] hover:decoration-[#004e4c] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{label}</span>
              <svg className="w-3.5 h-3.5 inline-block opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          );
        }

        // Check if bold **text**
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={i} className="font-bold text-[#0f5344]">
              {boldText}
            </strong>
          );
        }

        // Check if raw URL
        if (/^https?:\/\/[^\s]+$/.test(part)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-[#006967] underline decoration-[#006967]/60 underline-offset-2 hover:text-[#004e4c] hover:decoration-[#004e4c] font-semibold transition-colors break-all cursor-pointer"
            >
              {part}
            </a>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </>
  );
};
