import { usePathname, useRouter } from "next/navigation";

const useConnect = () => {
  const router = useRouter();
  const path = usePathname();

  const changeLanguage = () => {
    const segments = path.split("/");
    segments[1] = path.includes("/en/") ? "es" : "en";
    const newPath = segments.join("/");

    document.cookie = `NEXT_LOCALE=${path.includes("/en/") ? "es" : "en"}; path=/; SameSite=Lax`;

    router.push(newPath);
  };

  return {
    changeLanguage,
  };
};

export default useConnect;
