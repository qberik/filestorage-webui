import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import File from "./File";
import Folder from "./Folder";
import { delete_file, get_files, move_file, upload_file } from "@/api";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import {
  CollisionDetection,
  DndContext,
  DragOverlay,
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
  rectIntersection,
} from "@dnd-kit/core";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { File as FileIcon, Plus, TriangleAlertIcon } from "lucide-react";
import FileBreadcrumb from "./FileBreadcrumbs";
import { Button } from "./ui/button";
import SkeletFiles from "./SkeletFiles";

// Types
interface FileItem {
  comment: string;
  created_at: string;
  extension: string;
  filename: string;
  filepath: string;
  id: string;
  modified_at: string | null;
  size: number;
}

// Collision detection function
const fixCursorSnapOffset: CollisionDetection = (args) => {
  if (!args.pointerCoordinates) {
    return rectIntersection(args);
  }
  const { x, y } = args.pointerCoordinates;
  let { width, height } = args.collisionRect;
  const scale = (1 / 3) * 0.8;

  const updated = {
    ...args,
    collisionRect: {
      width: width * scale,
      height: height * scale,
      bottom: y + (height / 2) * scale,
      left: x - (width / 2) * scale,
      right: x + (width / 2) * scale,
      top: y - (height / 2) * scale,
    },
  };
  return rectIntersection(updated);
};

type FileListProps = {
  setError: (status: boolean) => void;
};

export default function FileList({ setError }: FileListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogFileIndex, setDialogFileIndex] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const defaultDraggableDropAnimation = {
    ...defaultDropAnimation,
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "1",
        },
      },
    }),
  };
  const [draggableDropAnimation, setDraggableDropAnimation] = useState(
    defaultDraggableDropAnimation,
  );
  const [selectedFolder, setSelectedFolder] = useState("/");

  useEffect(() => {
    get_files()
      .then((data: FileItem[]) => {
        setFiles(data);
        setPageLoading(false);
      })
      .catch((e) => setError(true));
  }, []);

  useEffect(() => {
    filterItemsByPath(selectedFolder);
  }, [selectedFolder]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    if (event.over) {
      setDraggableDropAnimation(null);
      if (event.over.id.startsWith("folder-")) {
        const DroppedFolder_index = parseInt(
          event.over.id.replace("folder-", ""),
        );
        const file = files.find((e) => e.id == activeId);
        file.filepath = file.filepath += moveFileToFolder(
          activeId,
          file.filepath + Folders[DroppedFolder_index] + "/",
        );
      } else {
        moveFileToFolder(activeId, (event.over.id + "/").replace("//", "/"));
      }
    } else {
      setDraggableDropAnimation(defaultDraggableDropAnimation);
    }
  };

  const moveFileToFolder = (fileIndex: string, newFolderName: string) => {
    move_file(fileIndex, newFolderName).catch((e) => setError(true));
    let file = files.find((e) => e.id == fileIndex);
    setFiles([
      ...files.filter((e) => e.id != fileIndex),
      { ...file, filepath: newFolderName },
    ]);
  };

  const removeFile = (fileIndex: string, conformation: boolean = false) => {
    if (conformation) {
      setFiles([...files.filter((e) => e.id != fileIndex)]);
      delete_file(fileIndex).catch((e) => setError(true));
    } else {
      setDialogFileIndex(fileIndex);
      setDialogOpen(true);
    }
  };

  const filterItemsByPath = (path: string) => {
    return {
      files: files.filter((file) => file.filepath === path),
      folders: files
        .map((f) => f.filepath)
        .filter((p) => p.startsWith(path))
        .map((p) => p.replace(path, "").split("/")[0])
        .filter((s) => s.length != 0)
        .filter((item, i, ar) => ar.indexOf(item) === i),
    };
  };

  const { files: Files, folders: Folders } = filterItemsByPath(selectedFolder);

  return (
    <>
      <DndContext
        collisionDetection={fixCursorSnapOffset}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <FileBreadcrumb path={selectedFolder} changePath={setSelectedFolder} />
        <div className="px-4 py-2">
          {pageLoading ? (
            <SkeletFiles></SkeletFiles>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Files.map((file) => (
                <File
                  key={file.id}
                  id={file.id}
                  filename={file.filename}
                  size={file.size.toString()}
                  lastDate={file.created_at}
                  removeFile={removeFile}
                />
              ))}
              {Folders.map((folder, index) => (
                <Folder
                  key={index}
                  id={`folder-${index}`}
                  foldername={folder}
                  goToFolder={() => {
                    setSelectedFolder(selectedFolder + folder + "/");
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <DragOverlay
          modifiers={[snapCenterToCursor]}
          dropAnimation={draggableDropAnimation}
        >
          {activeId ? (
            <div className="flex size-full items-center justify-center">
              <div className="size-1/3 rounded-full bg-black/20">
                <FileIcon className="m-auto h-full w-12 text-muted-foreground" />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <div className="fixed bottom-4 right-4">
        <input
          type="file"
          id="hidden-file-upload-button"
          className="hidden"
          onChange={(e) => {
            document.getElementById("file-upload-progress-filename").innerText =
              e.target.files[0].name;
            document
              .getElementById("file-upload-progress")
              .classList.remove("hidden");
            upload_file(e.target.files[0], selectedFolder)
              .then((response) => {
                setFiles([...files, response.data]);
                document
                  .getElementById("file-upload-progress")
                  .classList.add("hidden");
              })
              .catch((e) => setError(true));
          }}
        ></input>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            document.getElementById("hidden-file-upload-button").click()
          }
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <div
        id="file-upload-progress"
        className="fixed bottom-4 right-4 hidden w-80 rounded-md border border-input bg-background px-3 pb-2 pt-1"
      >
        <div className="leading-0 flex flex-row pb-0.5 text-base font-semibold">
          Загрузка:{" "}
          <div
            id="file-upload-progress-filename"
            className="truncate font-medium"
          ></div>
        </div>
        <div className="flex h-2.5 flex-col rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            id="file-upload-progress-bar"
            className="h-2.5 rounded-full bg-blue-500"
            style={{ width: "0%" }}
          ></div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="destructive">Не нажимай</Button>
        </DialogTrigger> */}
        <DialogContent className="rounded-md sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <TriangleAlertIcon className="size-12 text-red-500" />
            <div className="space-y-2 text-center">
              <DialogTitle>Удаление файла</DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить файл? Это действие необратимо.
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between">
            <Button
              onClick={() => {
                setDialogOpen(false);
              }}
              variant="outline"
            >
              Отмена
            </Button>

            <Button
              onClick={() => {
                removeFile(dialogFileIndex, true);
                setDialogOpen(false);
              }}
              variant="destructive"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
