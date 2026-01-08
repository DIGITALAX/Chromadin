import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useConnect = () => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const changeLanguage = () => {
    let newPath: string;
    const newLocale = path.includes("/en/") ? "es" : "en";

    if (path.includes("/en/") || path.includes("/es/")) {
      const segments = path.split("/");
      segments[1] = newLocale;
      newPath = segments.join("/");
    } else {
      newPath = `/${newLocale}${path}`;
    }

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; SameSite=Lax`;

    const params = searchParams.toString();
    router.push(params ? `${newPath}?${params}` : newPath);
  };

  return {
    changeLanguage,
  };
};

export default useConnect;
