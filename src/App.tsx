import React, { useState } from "react";
import "./index.css";

import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import FileList from "./components/FileList";
import Error from "./components/Error";
import "./api";

export default function App() {
  const [errorInApp, setErrorInApp] = useState(false);
  return <>{errorInApp ? <Error /> : <FileList setError={setErrorInApp} />}</>;
}
