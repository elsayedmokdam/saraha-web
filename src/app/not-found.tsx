import IsEmpty from "@/components/shared/is-empty/IsEmpty";
import { FiCompass } from "react-icons/fi";

export default function NotFound() {
  return (
    <IsEmpty
      icon={<FiCompass />}
      title="Page not found"
      description="The page you are looking for does not exist or was moved."
      links={[{ label: "Back to Home", href: "/" }]}
    />
  );
}
