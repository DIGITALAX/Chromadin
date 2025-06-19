"use client";

import { ModalContext } from "@/app/providers";
import { useContext, useEffect } from "react";
import ImageViewer from "./ImageViewer";
import Indexer from "./Indexer";
import MakePost from "./MakePost";
import { Indexar } from "../../Common/types/common.types";
import Signless from "./Signless";
import CrearCuenta from "./CrearCuenta";
import Success from "./Success";
import ModalOpen from "./ModalOpen";
import Who from "./Who";
import CollectOptions from "./CollectOptions";
import SimpleCollect from "./Collect";
import Gifs from "./Gifs";
import Follow from "./Follow";
import Metrics from "./Metrics";
import QuestSuccess from "./QuestSuccess";
import QuestGates from "./QuestGates";
import Quests from "./Quests";

export default function ModalsEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);

  useEffect(() => {
    if (context?.indexar !== Indexar?.Inactivo) {
      setTimeout(() => {
        context?.setIndexar(Indexar?.Inactivo);
      }, 4000);
    }
  }, [context?.indexar]);
  return (
    <>
      {context?.verImagen && <ImageViewer />}
      {context?.makePost?.open && <MakePost dict={dict} />}
      {context?.who && <Who dict={dict} />}
      {context?.gif?.open && <Gifs dict={dict} />}
      {context?.collectOptions?.open && <CollectOptions dict={dict} />}
      {context?.quest && <Quests dict={dict} />}
      {context?.metrics && <Metrics dict={dict} />}
      {context?.gates && <QuestGates dict={dict} />}
      {context?.follow && <Follow dict={dict} />}
      {context?.collect && <SimpleCollect dict={dict} />}
      {context?.success?.open && <Success dict={dict} />}
      {context?.questSuccess && <QuestSuccess dict={dict} />}
      {context?.modalOpen && <ModalOpen />}
      {context?.signless && <Signless dict={dict} />}
      {context?.crearCuenta && <CrearCuenta dict={dict} />}
      {context?.indexar !== Indexar.Inactivo && <Indexer dict={dict} />}
    </>
  );
}
