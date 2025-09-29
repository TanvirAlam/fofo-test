"use client";

import React from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import {
  Text,
  Overlay,
  ModalContainer,
  Title,
  Subtitle,
  Message,
  ButtonGroup,
  IconWrapper,
  CloseButton,
} from "./styles";
import { CrossIcon } from "@/assets/icons/crossIcon";
import GenericButton from "../Buttons";

type GenericModalProps = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  iconBgColor?: string;
  message: string;
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  buttonRow?: boolean;
  iconTop?: boolean;
};

export const GenericModal: React.FC<GenericModalProps> = ({
  visible,
  title,
  subtitle,
  children,
  iconBgColor,
  message,
  icon,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  onClose,
  buttonRow = false,
  iconTop = false,
}) => {
  const { t } = useTranslation();

  if (!visible) return null;

  return ReactDOM.createPortal(
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby={title && "generic-modal-title"}
      aria-describedby="generic-modal-message"
      data-testid="generic-modal-overlay"
    >
      <ModalContainer data-testid="generic-modal-container">
        {onClose && (
          <CloseButton
            type="button"
            aria-label={t("accessibility.closeModal")}
            onClick={onClose}
            data-testid="generic-modal-close"
          >
            <CrossIcon />
          </CloseButton>
        )}

        {icon && iconTop && (
          <IconWrapper $bgColor={iconBgColor} data-testid="generic-modal-icon">
            {icon}
          </IconWrapper>
        )}

        {title && (
          <Title id="generic-modal-title" data-testid="generic-modal-title">
            {title}
          </Title>
        )}

        {subtitle && <Subtitle>{subtitle}</Subtitle>}

        {icon && !iconTop && (
          <IconWrapper $bgColor={iconBgColor} data-testid="generic-modal-icon">
            {icon}
          </IconWrapper>
        )}

        {message && (
          <Message
            id="generic-modal-message"
            data-testid="generic-modal-message"
          >
            {message}
          </Message>
        )}
        {children && <div style={{ marginBottom: 16 }}>{children}</div>}

        {(confirmLabel ?? (cancelLabel && onCancel)) && (
          <ButtonGroup
            data-testid="generic-modal-button-group"
            $row={buttonRow}
          >
            {confirmLabel && (
              <GenericButton
                variant="primary"
                onClick={onConfirm}
                data-testid="generic-modal-confirm-button"
              >
                <Text use="Body_Title7">{confirmLabel}</Text>
              </GenericButton>
            )}

            {cancelLabel && onCancel && (
              <GenericButton
                variant="outline"
                onClick={onCancel}
                data-testid="generic-modal-cancel-button"
              >
                <Text use="Body_Title7">{cancelLabel}</Text>
              </GenericButton>
            )}
          </ButtonGroup>
        )}
      </ModalContainer>
    </Overlay>,
    document.body
  );
};
