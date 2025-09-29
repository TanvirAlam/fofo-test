"use client";
import Image from "next/image";
import {
  Container,
  Main,
  List,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  Footer,
  Code,
} from "../styles/root/root.style";
import { theme } from "@packages/ui";

export default function Home() {
  return (
    <Container>
      <Main>
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="Next.js logo"
          width={150}
          height={150}
          priority
        />
        <List>
          <li style={theme.typography.Heading4}>
            Get started by editing <Code>src/app/page.tsx</Code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </List>
        <ButtonGroup>
          <PrimaryButton
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </PrimaryButton>
          <SecondaryButton
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </SecondaryButton>
        </ButtonGroup>
      </Main>
      <Footer>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </Footer>
    </Container>
  );
}
