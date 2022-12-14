import React, {
  Dispatch, MouseEvent, SetStateAction, useRef,
} from 'react';
import styled from 'styled-components';
import useSelect from '@hooks/useSelect';

const Label = styled.label<{ width: number | string, type: string }>`
  position: relative;
  display: inline-block;
  width: ${({ width }) => (typeof width === 'string' ? width : `${width}px`)};
  color: ${({ theme }) => theme.palette.gray};
  margin: ${({ type }) => (type === 'register' ? '10px 0px' : '0')};
`;

const Select = styled.select<{type: string}>`
  padding: ${({ type }) => (type === 'register' ? '0rem' : '1rem')};
  width: 100%;
  outline: none;
  border: none;
  color: ${({ theme }) => theme.palette.gray};
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderGray};
  border-radius: 4px;
  cursor: pointer;
  font-size: ${({ type }) => (type === 'register' ? '1.5rem' : '2rem')};
`;

const SelectItemContainer = styled.div<{type: string}>`
  margin-top: 0.5rem;
  border: 1px solid ${({ theme }) => theme.palette.borderGray};
  border-radius: 5px;
  box-shadow: 0px 4px 13px rgba(0, 0, 0, 0.25);
  position: ${({ type }) => (type === 'register' ? 'absolute' : null)};
  width: ${({ type }) => (type === 'register' ? '100%' : null)};
  background-color: ${({ type }) => (type === 'register' ? 'white' : null)};
  z-index: 1;

  -webkit-animation: 0.3s linear normal slide_down;
          animation: 0.3s linear normal slide_down;

  @keyframes slide_down {
    0% {
      opacity: 0.1;
    }
    100% {
      opacity: 1;
    }
  }
`;

const SelectItem = styled.option<{type:string}>`
  height: ${({ type }) => (type === 'register' ? '1.5rem' : '2.5rem')};
  font-size: ${({ type }) => (type === 'register' ? '1.5rem' : '2rem')};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderGray};
  padding: 1rem 1rem 2rem 1rem;
  :hover {
    color: ${({ theme }) => theme.palette.eliceViolet}
  }
`;

const defaultProps = {
  requestFunc: null,
  type: '',
};

type ISelectBoxProps = {
  options: string[] | number[];
  defaultValue: string;
  selectedOption: string | number;
  setSelectedOption: Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<number>>;
  width: string | number;
  requestFunc?: any;
  type?: string;
} & typeof defaultProps;

function SelectBox({
  options,
  defaultValue,
  selectedOption,
  setSelectedOption,
  width,
  requestFunc,
  type,
}: ISelectBoxProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [clickSelectedBox, setClickSelectedBox] = useSelect(labelRef); // SelectBox??? ??????????????? ?????? ??????

  // SelectBox ?????? ????????? ?????????
  const handleOpenSelectBox = (e: MouseEvent) => {
    e.preventDefault();
    if (e.button === 0) { setClickSelectedBox(true); }
  };

  // requestFunc??? ????????? API ?????? ?????? ????????? ??????
  const handleSelectItemClick = (e: any) => {
    const optionValue = e.target.value; // ????????? option

    setSelectedOption(optionValue); // ????????? Option Value ??????
    setClickSelectedBox(false); // Option ???????????? Select Box ??????

    if (requestFunc) {
      requestFunc(optionValue); // ????????? Option??? ????????? ?????? ?????? ??????
    }
  };

  return (
    <Label
      width={width}
      ref={labelRef}
      type={type}
      onMouseDown={handleOpenSelectBox}
    >
      <Select type={type} value={selectedOption} onChange={handleSelectItemClick}>
        <option>{defaultValue}</option>
        {options.map((option, i) => (
          <option key={String(i) + option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      {clickSelectedBox && (
        <SelectItemContainer type={type}>
          {options.map((option, i) => (
            <SelectItem
              key={String(i) + option}
              onClick={handleSelectItemClick}
              type={type}
            >
              {option}
            </SelectItem>
          ))}
        </SelectItemContainer>
      )}
    </Label>
  );
}

SelectBox.defaultProps = defaultProps;

export default SelectBox;
