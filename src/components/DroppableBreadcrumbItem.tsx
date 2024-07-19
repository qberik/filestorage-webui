import React from "react";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useDroppable } from "@dnd-kit/core";
import { ChevronRightIcon, HomeIcon } from "lucide-react";

interface DroppableBreadcrumbItemProps {
  fullPath: string;
  segment: string;
  isLast: boolean;
  changePath: (newPath: string) => void;
}

const DroppableBreadcrumbItem: React.FC<DroppableBreadcrumbItemProps> = ({
  fullPath,
  segment,
  isLast,
  changePath,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: fullPath });

  return (
    <>
      {fullPath !== "/" && (
        <BreadcrumbSeparator>
          <ChevronRightIcon className="my-0 h-8 w-8 text-muted-foreground" />
        </BreadcrumbSeparator>
      )}
      <BreadcrumbItem className={`rounded-full ${isOver ? "bg-gray-200" : ""}`}>
        <div
          ref={setNodeRef}
          // TODO: ПЕРЕПИСАТЬ
          className="mx-3 my-2 flex items-center"
        >
          <BreadcrumbLink
            href={fullPath}
            className={`text-xl leading-none ${isLast ? "font-bold" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              changePath((fullPath + "/").replace("//", "/"));
            }}
          >
            {fullPath === "/" ? (
              <div className="flex flex-row items-center gap-2">
                <HomeIcon className="h-6 w-6" />{" "}
                <div className="text-xl leading-none">Мой диск</div>
              </div>
            ) : (
              segment
            )}
          </BreadcrumbLink>
        </div>
      </BreadcrumbItem>
    </>
  );
};

export default DroppableBreadcrumbItem;
