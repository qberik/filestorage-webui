import React from "react";
import { BASE_URLS } from "@/api";

export default function Error() {
  return (
    <div className="flex h-full flex-col justify-center bg-background">
      <div className="text-center">
        <div>Ошибка подключения</div>
        <div>проверьте подключение с сервером</div>
        <a
          className="text-blue-500 underline visited:text-purple-600"
          href={BASE_URLS + "/files"}
        >
          Проверить доступ
        </a>
      </div>
    </div>
  );
}
