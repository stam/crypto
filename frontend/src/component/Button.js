import styled from 'styled-components';

export default styled.button`
  cursor: pointer;
  width: 100%;
  padding: 8px 16px;
  border-radius: 4px;

  font-size: 1em;
  color: white;
  background: linear-gradient(95deg, rgb(244, 132, 186), rgb(161, 129, 223));
  border: none;
  outline: none;

  transition: all 0.1s ease-in-out;

  &:hover {
    filter: brightness(1.1);
  }
`;
