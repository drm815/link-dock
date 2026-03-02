import { useState } from 'react';
import { Settings, ExternalLink } from 'lucide-react';

interface SheetSetupProps {
    currentUrl: string;
    onSave: (url: string) => void;
}

export function SheetSetup({ currentUrl, onSave }: SheetSetupProps) {
    const [url, setUrl] = useState(currentUrl);
    const [open, setOpen] = useState(false);

    const handleSave = () => {
        if (!url.trim()) return;
        onSave(url.trim());
        setOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Google Sheet 설정"
            >
                <Settings className="w-4 h-4" />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Google Sheet 연동 설정</h2>

                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>
                                <a
                                    href="https://sheets.new"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline inline-flex items-center gap-1 hover:text-foreground"
                                >
                                    새 구글 시트 열기 <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>상단 메뉴 → 확장 프로그램 → Apps Script</li>
                            <li>아래 코드를 붙여넣고 저장 (Ctrl+S)</li>
                            <li>배포 → 새 배포 → 웹 앱 → 액세스: 모든 사용자 → 배포</li>
                            <li>발급된 URL을 아래에 붙여넣기</li>
                        </ol>

                        <div className="bg-muted rounded-xl p-3 text-xs font-mono overflow-auto max-h-48 select-all whitespace-pre">
{`function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('links')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('links');
  const rows = sheet.getDataRange().getValues();
  const links = rows.slice(1).map(r => ({
    id: r[0], title: r[1], url: r[2], category: r[3], createdAt: r[4]
  })).filter(l => l.id);
  return ContentService.createTextOutput(JSON.stringify(links))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('links')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('links');
  const payload = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id','title','url','category','createdAt']);
  }

  if (payload.action === 'add') {
    const l = payload.link;
    sheet.appendRow([l.id, l.title, l.url, l.category, l.createdAt]);
  } else if (payload.action === 'delete') {
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] === payload.id) { sheet.deleteRow(i + 1); break; }
    }
  }
  return ContentService.createTextOutput('ok');
}`}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Apps Script 배포 URL</label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://script.google.com/macros/s/..."
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!url.trim()}
                                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                저장 및 연동
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
