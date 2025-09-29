"use client";
import { AvatarIcon } from "@/assets/icons/avterIcon";
import GenericButton from "@/components/ui/Buttons";
import InputField from "@/components/ui/InputFields";
import { BUTTON_TYPE } from "@/utils/constants";
import { COLORS } from "@packages/ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ButtonGroup,
  Container,
  Main,
  StyledLogoIcon,
} from "../styles/root/root.style";
import { GenericModal } from "./ui/Modals";

export default function Home() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [managerModalOpen, setManagerModalOpen] = useState(false);

  const openWelcomeModal = () => {
    if (!managerModalOpen) {
      // Only open if no other modal is open
      setModalOpen(true);
    }
  };

  const openManagerModal = () => {
    if (!modalOpen) {
      // Only open if no other modal is open
      setManagerModalOpen(true);
    }
  };

  return (
    <Container>
      <Main>
        <StyledLogoIcon />
        <ButtonGroup>
          <GenericButton
            variant={BUTTON_TYPE.PRIMARY}
            onClick={openWelcomeModal}
            tabIndex={2}
          >
            {t("Welcome")}
          </GenericButton>
          <GenericButton disabled tabIndex={-1}>
            {t("Disable")}
          </GenericButton>
          <GenericButton
            variant={BUTTON_TYPE.PRIMARY}
            onClick={openManagerModal}
            tabIndex={3}
          >
            {t("Manager")}
          </GenericButton>
          <GenericButton
            variant={BUTTON_TYPE.OUTLINE}
            onClick={() => {
              throw new Error(
                "This is a test error to check the error boundary."
              );
            }}
          >
            Test Error
          </GenericButton>
        </ButtonGroup>
        <InputField
          label={t("fullName")}
          placeholder={t("enterName")}
          type="text"
          tabIndex={1}
        />
      </Main>
      <GenericModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("forgetPasswordTitle")}
        subtitle={t("forgetPasswordSubtitle")}
        message={t("forgetPasswordMessage")}
        icon={<AvatarIcon width={58} height={58} />}
        iconTop={false}
        iconBgColor={COLORS.primary[100]}
        confirmLabel={t("requestPinReset")}
        onConfirm={() => {
          setModalOpen(false);
        }}
      />

      <GenericModal
        visible={managerModalOpen}
        onClose={() => setManagerModalOpen(false)}
        title={t("resetPasswordTitle")}
        message={t("resetPasswordMessage")}
        confirmLabel={t("resendPassword")}
        cancelLabel={t("cancel")}
        onConfirm={() => {
          setManagerModalOpen(false);
        }}
        onCancel={() => setManagerModalOpen(false)}
        buttonRow={true}
      >
        <InputField
          label={t("viaEmail")}
          placeholder={t("enterRegisteredEmail")}
        />
      </GenericModal>
    </Container>
  );
}
