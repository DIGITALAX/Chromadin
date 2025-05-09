import Frequency from "../components/Common/modules/Frequency";
import Marquee from "../components/Common/modules/Marquee";
import Modals from "../components/Modals/modules/Modals";

export type tParams = Promise<{ lang: string }>;
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: tParams;
}>) {
  return (
    <>
      <div className="relative w-full h-full flex flex-col overflow-x-hidden">
        {children}
        <Frequency params={params} />
        <Marquee params={params} />
        <Modals params={params} />
      </div>
    </>
  );
}
