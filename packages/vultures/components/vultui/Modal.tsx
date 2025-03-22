import { colors } from "@/theme/colors";
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

  const openModal = (component: ({ onCancel }: ModalComponentTypes) => ReactElement) => {
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
            position: 'absolute',
            top: '0px',
            left: '0px',
            backgroundColor: colors.background,
            opacity: 0.5,
            zIndex: 1
          }} />
        <div style={{
          position: 'relative',
          height: "100%",
          width: "100%",
          zIndex: 2
        }} >
          {modalContent({ onCancel: () => closeModal() })}
        </div>
      </div>
    }
  </div >
}

export const ModalContainer = ({ children, style, parentStyle }: { children?: ReactElement, style?: {}, parentStyle?: {} }) => {
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
      style={{
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