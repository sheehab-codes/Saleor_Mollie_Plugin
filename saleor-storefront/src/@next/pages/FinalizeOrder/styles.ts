import { DefaultTheme, media, styled } from "@styles";

export const Wrapper = styled.div`
  margin: 80px 0;

  ${media.smallScreen`
    margin: 40px 0;
  `}
`;

export const RedirectHeader = styled.p`
  font-size: ${props => props.theme.typography.ultraBigFontSize};
  margin: 0;
  line-height: 110%;
  span {
    font-weight: ${props => props.theme.typography.boldFontWeight};
  }
  padding-bottom: 40px;
  border-bottom: 1px solid
    ${props => props.theme.colors.baseFontColorTransparent};
  margin-bottom: 40px;

  ${media.smallScreen`
    font-size: ${(props: { theme: DefaultTheme }) =>
      props.theme.typography.h1FontSize};
  `}
`;

export const Paragraph = styled.p`
  font-size: ${props => props.theme.typography.h4FontSize};
  margin: 0;
  line-height: 170%;

  span {
    font-weight: ${props => props.theme.typography.boldFontWeight};
  }
`;

export const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
`;