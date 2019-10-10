import styled from 'styled-components';

export default styled.button`
  cursor: pointer;
  width: 100%;
  padding: 8px 16px;
  border-radius: 4px;

  font-size: 1em;
  color: white;
  background: #6ec990;
  border: none;
  outline: none;

  transition: background 0.1s ease-in-out;

  &:hover {
    background: #60b27e;
  }
`;
