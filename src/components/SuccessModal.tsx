import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteName: string;
}

export function SuccessModal({ isOpen, onClose, athleteName }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-green-600">
            Inscrição Confirmada!
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <p className="font-medium text-gray-700">
              Parabéns {athleteName}!
            </p>
            <p className="text-gray-600">
              Sua inscrição para o <strong>PB MUSCLE ARENA</strong> foi realizada com sucesso.
            </p>
            <p className="text-sm text-gray-500">
              Mais informações e sua ficha de inscrição foram enviadas por email.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="bg-orange-600 hover:bg-orange-700">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}