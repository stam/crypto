import styled from 'styled-components';

export default styled.select`
  -webkit-appearance: none;
  padding: 0 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  height: 2.5rem;
  border: none;
  border-radius: 2px;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  &:not(:disabled) {
    color: white;
  }
`;
