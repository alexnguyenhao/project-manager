import { Circle, CirclePlus, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoDataFoundProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const NoDataFound = ({
  title,
  description,
  buttonText,
  onButtonClick,
}: NoDataFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      <FileSearch className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm mt-1">{description}</p>}
      {buttonText && onButtonClick && (
        <Button className="mt-4" onClick={onButtonClick}>
          <CirclePlus className="size-4 mr-2" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};
