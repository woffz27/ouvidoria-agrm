import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TColor from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ImageExt from "@tiptap/extension-image";
import { useState, useCallback, useEffect } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Undo2, Redo2, Quote, Code, Heading1, Heading2, Heading3,
  Palette, RemoveFormatting, FileCode,
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { uploadArquivos } from "@/hooks/use-atendimentos";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#cccccc",
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1", "#a855f7",
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <div className="w-px h-5 bg-border mx-0.5" />;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Escreva aqui...",
  minHeight = "120px",
  className,
}: RichTextEditorProps) {
  const [showSource, setShowSource] = useState(false);
  const [sourceCode, setSourceCode] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      TColor,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      ImageExt.configure({ inline: true }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none prose prose-sm max-w-none px-3 py-2",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      try {
        const [url] = await uploadArquivos([file]);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        // silently fail
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkUrl("");
  }, [editor, linkUrl]);

  const toggleSource = useCallback(() => {
    if (!editor) return;
    if (!showSource) {
      setSourceCode(editor.getHTML());
      setShowSource(true);
    } else {
      editor.commands.setContent(sourceCode);
      onChange(sourceCode);
      setShowSource(false);
    }
  }, [editor, showSource, sourceCode, onChange]);

  if (!editor) return null;

  const iconSize = "h-3.5 w-3.5";

  return (
    <div className={cn("border rounded-md bg-background overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-1.5 py-1 border-b bg-muted/30">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer">
          <Undo2 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer">
          <Redo2 className={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Título 1">
          <Heading1 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Título 2">
          <Heading2 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Título 3">
          <Heading3 className={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrito">
          <Bold className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Itálico">
          <Italic className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Sublinhado">
          <UnderlineIcon className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Tachado">
          <Strikethrough className={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Alinhar à esquerda">
          <AlignLeft className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centralizar">
          <AlignCenter className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Alinhar à direita">
          <AlignRight className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justificar">
          <AlignJustify className={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista">
          <List className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
          <ListOrdered className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citação">
          <Quote className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Bloco de código">
          <Code className={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Color picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" title="Cor do texto" className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Palette className={iconSize} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="grid grid-cols-5 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="mt-1 text-xs text-muted-foreground hover:text-foreground w-full text-center"
            >
              Remover cor
            </button>
          </PopoverContent>
        </Popover>

        {/* Link */}
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" title="Inserir link" className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("link") ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <LinkIcon className={iconSize} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <div className="space-y-2">
              <Input
                placeholder="https://exemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setLink()}
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs" onClick={setLink}>Aplicar</Button>
                {editor.isActive("link") && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => editor.chain().focus().unsetLink().run()}>
                    Remover
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <ToolbarButton onClick={handleImageUpload} title="Inserir imagem">
          <ImageIcon className={iconSize} />
        </ToolbarButton>

        <ToolbarSeparator />

        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Limpar formatação">
          <RemoveFormatting className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleSource} active={showSource} title="Código fonte">
          <FileCode className={iconSize} />
        </ToolbarButton>
      </div>

      {/* Editor / Source */}
      {showSource ? (
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          className="w-full px-3 py-2 font-mono text-xs bg-background outline-none resize-y"
          style={{ minHeight }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
