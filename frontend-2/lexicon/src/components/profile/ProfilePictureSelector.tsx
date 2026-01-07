import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Available profile pictures
const PROFILE_PICTURES = [
  { id: "asian_girl", name: "Asian Girl", path: "/profile picture/asian_girl-min.png" },
  { id: "asian_guy", name: "Asian Guy", path: "/profile picture/asian_guy-min.png" },
  { id: "black_girl", name: "Black Girl", path: "/profile picture/black_girl-min.png" },
  { id: "black_guy", name: "Black Guy", path: "/profile picture/black_guy-min.png" },
  { id: "tan_girl", name: "Tan Girl", path: "/profile picture/tan_girl-min.png" },
  { id: "tan_guy", name: "Tan Guy", path: "/profile picture/tan_guy-min.png" },
  { id: "white_girl", name: "White Girl", path: "/profile picture/white_girl-min.png" },
  { id: "white_guy", name: "White Guy", path: "/profile picture/white_guy-min.png" },
];

interface ProfilePictureSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar?: string;
  onSelect: (avatarUrl: string) => void;
}

export function ProfilePictureSelector({
  open,
  onOpenChange,
  currentAvatar,
  onSelect,
}: ProfilePictureSelectorProps) {
  const [selectedPicture, setSelectedPicture] = useState<string>(currentAvatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (pictureUrl: string) => {
    setSelectedPicture(pictureUrl);
  };

  const handleConfirm = async () => {
    if (!selectedPicture) return;
    
    setIsSubmitting(true);
    try {
      await onSelect(selectedPicture);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">Choose Your Profile Picture</DialogTitle>
          <DialogDescription>
            Select an avatar that represents you best
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 py-6">
          {PROFILE_PICTURES.map((picture) => {
            const isSelected = selectedPicture === picture.path;
            
            return (
              <button
                key={picture.id}
                onClick={() => handleSelect(picture.path)}
                className={cn(
                  "relative group rounded-xl overflow-hidden transition-all duration-300",
                  "hover:scale-105 hover:shadow-lg",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isSelected && "ring-4 ring-primary shadow-xl scale-105"
                )}
                type="button"
              >
                <div className="aspect-square bg-muted">
                  <img
                    src={picture.path}
                    alt={picture.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Selection Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Hover Effect */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "flex items-end justify-center pb-2"
                )}>
                  <span className="text-white text-xs font-medium">
                    {picture.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPicture || isSubmitting}
            className="bg-primary hover:bg-primary-hover"
          >
            {isSubmitting ? "Saving..." : "Save Picture"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
