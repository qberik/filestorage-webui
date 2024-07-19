import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "./ui/card";
import {
  DownloadIcon,
  File as FileIcon,
  FileTextIcon,
  Share2Icon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

import { getRelativeTimeString } from "@/date";
import { delete_file, get_file_download_url, get_file_open_url } from "@/api";
import { Button } from "./ui/button";

type FileProps = {
  id: string;
  filename?: string;
  size?: string;
  lastDate?: string;
  removeFile: (id: string) => void;
};

export default function File({
  id,
  filename = "Untitled",
  size = "Unknown",
  lastDate = "Unknown",
  removeFile,
}: FileProps) {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, disabled: isContextMenuOpen });
  const style = {
    // transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="rounded-lg transition-opacity"
    >
      <ContextMenu onOpenChange={(e) => setIsContextMenuOpen(e)}>
        <ContextMenuTrigger>
          <Card className="relative aspect-square overflow-hidden shadow-sm transition-all hover:shadow-md">
            <CardContent className="flex h-full w-full flex-col items-center justify-center p-2">
              <FileIcon className="h-12 w-12 text-muted-foreground" />
              <div className="mt-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm font-medium">
                {filename}
              </div>
              {size && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Size: {size}
                </div>
              )}
              {lastDate && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Изменено: {getRelativeTimeString(lastDate)}
                </div>
              )}
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem
            onClick={() => {
              window.open(get_file_open_url(id), "_blank").focus();
            }}
          >
            <FileTextIcon className="mr-2 h-4 w-4" />
            Open
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              window.open(get_file_download_url(id), "_blank").focus();
            }}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </ContextMenuItem>
          {/* <ContextMenuItem
            onClick={() => {
              navigator.clipboard.writeText(get_file_open_url(id));
            }}
          >
            <Share2Icon className="mr-2 h-4 w-4" />
            Copy URL
          </ContextMenuItem> */}
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => {
              // setIsContextMenuOpen(true);
              // // setDialogOpen(true);
              removeFile(id);
            }}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
