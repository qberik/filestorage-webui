import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent } from "./ui/card";
import {
  Folder as FolderIcon,
  FileTextIcon,
  DownloadIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

type FolderProps = {
  id: string;
  foldername?: string;
  size?: string;
  lastDate?: string;
  goToFolder?: () => void;
  onOver?: (droppedId: string) => void;
};

export default function Folder({
  id,
  foldername = "Untitled",
  // size = "Unknown",
  // lastDate = "Unknown",
  onOver: onDrop,
  goToFolder: goToFolder,
}: FolderProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const handleDrop = (droppedId: string) => {
    if (onDrop) {
      onDrop(droppedId);
    }
  };

  React.useEffect(() => {
    if (isOver) {
      handleDrop(id);
    }
  }, [isOver, id]);

  return (
    <div
      ref={setNodeRef}
      className={`cursor-pointer rounded-lg transition-opacity ${isOver ? "bg-blue-100 ring-2 ring-blue-500" : ""}`}
      onClick={goToFolder}
    >
      {/* <ContextMenu>
        <ContextMenuTrigger> */}
      <Card className="relative aspect-square overflow-hidden shadow-sm transition-all hover:shadow-md">
        <CardContent className="flex h-full w-full flex-col items-center justify-center p-2">
          <FolderIcon className="h-12 w-12 text-muted-foreground" />
          <div className="mt-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm font-medium">
            {foldername}
          </div>
          {/* {size && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Size: {size}
                </div>
              )}
              {lastDate && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Last Modified: {lastDate}
                </div>
              )} */}
        </CardContent>
      </Card>
      {/* </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem>
            <FileTextIcon className="mr-2 h-4 w-4" />
            Open
          </ContextMenuItem>
          <ContextMenuItem>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </ContextMenuItem>
          <ContextMenuItem>
            <Share2Icon className="mr-2 h-4 w-4" />
            Share
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu> */}
    </div>
  );
}
