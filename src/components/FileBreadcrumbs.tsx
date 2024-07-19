import React from "react";
import { Breadcrumb, BreadcrumbList } from "./ui/breadcrumb";
import DroppableBreadcrumbItem from "./DroppableBreadcrumbItem";

interface FileBreadcrumbProps {
  path: string;
  changePath: (newPath: string) => void;
}

const FileBreadcrumb: React.FC<FileBreadcrumbProps> = ({
  path,
  changePath,
}) => {
  const paths = path.split("/").filter(Boolean);

  return (
    <div className="mx-4 mb-0 mt-1 overflow-x-hidden">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center whitespace-nowrap">
          <DroppableBreadcrumbItem
            key="/"
            fullPath="/"
            segment=""
            isLast={paths.length === 0}
            changePath={changePath}
          />
          {paths.map((segment, index) => {
            const fullPath = "/" + paths.slice(0, index + 1).join("/");
            return (
              <DroppableBreadcrumbItem
                key={fullPath}
                fullPath={fullPath}
                segment={segment}
                isLast={index === paths.length - 1}
                changePath={changePath}
              />
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default FileBreadcrumb;
