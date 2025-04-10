import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export function InfoAlert() {
  return (
    <Alert className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300">
      <Info className="h-4 w-4" />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>This is an informational message.</AlertDescription>
    </Alert>
  );
}

export function SuccessAlert() {
  return (
    <Alert className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your operation was successful.</AlertDescription>
    </Alert>
  );
}

export function WarningAlert() {
  return (
    <Alert className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>There might be something wrong.</AlertDescription>
    </Alert>
  );
}

export function DestructiveAlert() {
  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong.</AlertDescription>
    </Alert>
  );
}
