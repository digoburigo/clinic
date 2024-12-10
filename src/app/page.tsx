import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

export default function HomePage() {
  return (
    <main >
      <Dialog>
        <DialogTrigger>
        <Button>Click me</Button>
        </DialogTrigger>
        <DialogContent>sasd</DialogContent>
      </Dialog>
    </main>
  );
}
