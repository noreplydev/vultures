import { colors, translucent } from "@/theme";
import { atom, useAtom } from "jotai"
import React, { ReactElement, useEffect } from "react"

export type ModalComponentTypes = {
  onCancel: () => void;
}

const ModalVisibilityAtom = atom<boolean>(false)
const ModalContentAtom = atom<any>(null)

export const useModal = () => {
  const [showModal, setShowModal] = useAtom(ModalVisibilityAtom)
  const [modalContent, setModalContent] = useAtom(ModalContentAtom)

  const openModal = (component: ({ onCancel }: ModalComponentTypes & any) => ReactElement) => {
    setModalContent(() => component);
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return { openModal, closeModal };
}

export const ModalProvider = ({ children }: { children: any }) => {
  const [showModal, setShowModal] = useAtom(ModalVisibilityAtom)
  const [modalContent, setModalContent] = useAtom(ModalContentAtom)

  const closeModal = () => { setShowModal(false); setModalContent(null) }

  return <div
    style={{
      height: "100%",
      width: "100%"
    }}
  >
    {children}
    {
      showModal && modalContent && <div
        className="fixed top-0 left-0 h-screen w-screen"
      >
        <div
          onClick={() => closeModal()}
          style={{
            height: "100%",
            width: "100%",
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: translucent(colors.background),
          }} >
          {React.createElement(modalContent, { onCancel: () => closeModal() })}
        </div>
      </div>
    }
  </div >
}

export const ModalContainer = ({ children, style, parentStyle }: { children?: ReactElement[] | ReactElement, style?: {}, parentStyle?: {} }) => {
  return <div
    style={{
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
      ...parentStyle
    }}
  >
    <div
      onClick={(e) => { e.stopPropagation() }}
      style={{
        display: 'flex',
        height: "fit-content",
        width: "fit-content",
        paddingBlock: "5px",
        paddingInline: "10px",
        borderRadius: "5px",
        backgroundColor: colors.backgroundSecondary,
        ...style
      }}
    >
      {children}
    </div>
  </div>
}