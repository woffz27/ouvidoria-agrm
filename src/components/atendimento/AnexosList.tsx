import { FileText, ImageIcon, Video, ExternalLink } from "lucide-react";

interface AnexosListProps {
  arquivos: string[] | null;
}

function getFileType(url: string) {
  const ext = url.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "webm", "mov", "avi"].includes(ext)) return "video";
  return "document";
}

export function AnexosList({ arquivos }: AnexosListProps) {
  if (!arquivos || arquivos.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {arquivos.map((url, i) => {
        const type = getFileType(url);
        if (type === "image") {
          return (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block">
              <img
                src={url}
                alt={`Anexo ${i + 1}`}
                className="h-16 w-16 rounded-md object-cover border hover:opacity-80 transition-opacity"
              />
            </a>
          );
        }
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border bg-muted/30 px-2.5 py-1.5 text-xs hover:bg-muted/50 transition-colors"
          >
            {type === "video" ? <Video className="h-3.5 w-3.5 text-secondary" /> : <FileText className="h-3.5 w-3.5 text-primary" />}
            <span className="max-w-[120px] truncate">Anexo {i + 1}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        );
      })}
    </div>
  );
}
