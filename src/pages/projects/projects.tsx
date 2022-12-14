/* eslint-disable no-underscore-dangle */
import React, {
  MouseEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { useSetRecoilState } from 'recoil';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import Button from '@/components/button';
import Search from '@/components/search';
import Card from '@/components/card';
import Pagination from '@/components/pagination';
import useToken from '@/hooks/useToken';
import SelectBox from '@/components/selectBox';

import modalAtom from '@/recoil/modal/modalAtom';
import { IProjectGetParamsProps, IProjectProps } from '@/interfaces/interface';
import { getAllProjects } from '@/lib/projectApi';

const ProjectContainer = styled.div`
  padding: 3rem;
  margin-left: auto;
  margin-right: auto;
`;

const Alignments = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  margin: 1rem 0;
`;

const Alignment = styled.li<{current: boolean}>`
  vertical-align: middle;
  margin-left: 2rem;
  list-style-type: disc;
  color: ${(props) => (props.current ? props.theme.palette.eliceViolet : props.theme.palette.gray)};
  font-size: 1.5rem;
  font-weight: ${(props) => (props.current ? '700' : '500')};
  line-height: 26px;
  cursor: pointer;
  &:hover {
    color: ${(props) => (props.theme.palette.eliceViolet)};
    font-weight: 700;
  }
`;

const ProjectHeader = styled.div`
  font-size: 3rem;
  margin: 2rem 0rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderGray};
  padding-bottom: 4rem;
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  justify-content: space-between;
`;

const RightHead = styled.div`
  display: flex;
  gap: 3rem;
  flex-direction: row;
  place-items: center;
`;

const SearchContainer = styled.div`
`;

const ButtonContainer = styled.div`
  min-height: 45px;
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  place-items: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const SelectBoxWrapper = styled.div`
  position: absolute;
  right: 0;
  & select {
    text-align: center;
    height: 3.5rem;
    border: 1.5px solid ${({ theme }) => theme.palette.borderGray}
  }
`;

export default function Projects() {
  const setModal = useSetRecoilState(modalAtom);
  const { authInfo } = useToken();
  const sortRef = useRef<HTMLLIElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get('filter');

  const [perPage, setPerPage] = useState<string>('8');
  const [query, setQuery] = useState<IProjectGetParamsProps>({
    filter: 'date', page: '1', perPage: '6',
  });

  // Modal Control
  const handleProjectEnrollment = useCallback((modalType: any) => {
    setModal(modalType);
  }, []);

  // ???????????? ??????
  const handleSort = useCallback((e: MouseEvent<HTMLLIElement>, sortType: string) => {
    if (sortRef.current) {
      sortRef.current.removeAttribute('selected');
    }
    sortRef.current = e.target as HTMLLIElement;
    sortRef.current.setAttribute('selected', '');

    searchParams.set('filter', sortType);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  }, []);

  // ???????????? ???????????? ??? ??????
  const handlePerPage = useCallback((perP: string) => {
    searchParams.set('perPage', perP);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  }, []);

  // ????????? ????????? ?????? URL ??????
  const handleNavigate = useCallback((pageNumber: number) => {
    searchParams.set('page', `${pageNumber + 1}`);
    setSearchParams(searchParams);
  }, []);

  const { data, refetch } = useQuery(['projectList', query], () => getAllProjects(query), {
    suspense: true,
  });

  useEffect(() => {
    searchParams.forEach((v, k) => setQuery((q) => ({ ...q, [k]: v })));
    refetch();
  }, [searchParams]);

  return (
    <ProjectContainer>
      <ProjectHeader>
        ???????????? ?????????
        <RightHead>
          <SearchContainer>
            <Search projectQuery={query} />
          </SearchContainer>
          {authInfo?.token && authInfo.role !== 'guest' && (
          <ButtonContainer>
            <Button size="medium" onClick={() => handleProjectEnrollment('ProjectRegister')}>???????????? ??????</Button>
          </ButtonContainer>
          )}
        </RightHead>
      </ProjectHeader>
      <Alignments>
        <Alignment current={currentFilter === 'date'} onClick={(e) => handleSort(e, 'date')}>?????????</Alignment>
        <Alignment current={currentFilter === 'views'} onClick={(e) => handleSort(e, 'views')}>?????????</Alignment>
        <SelectBoxWrapper className="selectbox-perpage">
          <SelectBox options={['3', '6', '9', '12']} defaultValue="6" selectedOption={perPage} setSelectedOption={setPerPage} requestFunc={handlePerPage} width={70} type="register" />
        </SelectBoxWrapper>
      </Alignments>
      <Content>
        {(data.projectList).map((project: IProjectProps) => (
          <Card
            key={project._id}
            projectId={project._id}
            title={project.title}
            author={project.author}
            shortDescription={project.shortDescription}
            description={project.description}
            thumbnail={project.thumbnail}
            likes={project.likes.length}
            tags={project.tags}
            date={project.createdAt}
            views={project.views}
            type="project"
          />
        ))}
      </Content>
      <PaginationContainer>
        <Pagination
          length={data.totalPage}
          start={query.page ? +(query.page) - 1 : 0}
          handler={(pageNumber) => handleNavigate(pageNumber)}
        />
      </PaginationContainer>
    </ProjectContainer>
  );
}
