import NotFound from "@/components/Common/Loading/NotFound";
import Head from "next/head";
import { NextRouter } from "next/router";
import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";

const Custom404: FunctionComponent<{
  router: NextRouter;
}> = ({ router }): JSX.Element => {
  const { t } = useTranslation("common");
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-x-hidden">
      <Head>
        <title>Page Not Found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NotFound t={t} router={router} />
    </div>
  );
};

export default Custom404;
