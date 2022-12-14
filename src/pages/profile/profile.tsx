import React from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FaCarrot } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import authAtom from '@/recoil/auth/authAtom';
import useToken from '@/hooks/useToken';
import { getOtherPage } from '@/lib/userApi';

const ProfileContainer = styled.div`
  width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ProfileBox = styled.div`
  margin-top: 5rem;
`;

const ProfileInfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.borderGray};
`;
const ProfileImgBox = styled.a`
`;
const ProfileImg = styled.img`
  display: block;
  width: 13rem;
  height: 13rem;
  border-radius: 50%;
  object-fit: cover;
`;
const ProfileInfo = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: column;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.gray};
`;
const ProfileName = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.palette.black};
`;
const Track = styled.div`
`;

const CarrotBox = styled.div`
  display: flex;
  gap: 1rem;
  color: orange;
  font-size: 1.8rem;
  font-weight: 500;
`;
const Carrot = styled.div`
  color: ${({ theme }) => theme.palette.gray};
`;
const ProfileSubBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 3rem;
  padding: 0 1rem;
`;
const GitHubBox = styled.a`
  display: flex;
  gap: 1rem;
  align-items: center;
  color: ${({ theme }) => theme.palette.gray};
  transition: color 0.3s;
  &:hover{
    color: ${({ theme }) => theme.palette.black};
  }
`;
const SubInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.palette.gray};
`;

const Category = styled.span`
  color: ${({ theme }) => theme.palette.black};
`;
const EmptyField = styled.p`
  width: 100%;
  text-align: center;
  margin-top: 23rem;
  margin-bottom: 18rem;
  color: ${({ theme }) => theme.palette.black};
  opacity: 0.5;
  font-size: 4rem;
  font-weight: 700;
`;

export default function name() {
  const auth = useRecoilValue(authAtom);
  const [query] = useSearchParams();
  const userId = query.get('id');
  const { authInfo } = useToken();
  if (!userId) {
    return (<EmptyField>???????????? ????????? ????????????.</EmptyField>);
  }
  if (!auth) {
    return (<EmptyField>????????? ??? ?????????.</EmptyField>);
  }
  const { data } = useQuery(['getUserData', userId], () => getOtherPage(authInfo!.token, userId as string));
  if (data && data.result === 'CastError') {
    return (<EmptyField>???????????? ????????? ????????????.</EmptyField>);
  }
  if (data && data.result === 'NotFound') {
    return (<EmptyField>{data.reason}</EmptyField>);
  }
  return (
    <ProfileContainer>
      {data && (
        <ProfileBox>
          <ProfileInfoBox>
            <ProfileImgBox>
              <ProfileImg src={data.githubAvatar} />
            </ProfileImgBox>
            <ProfileInfo>
              <ProfileName>{data.name}</ProfileName>
              <Track>{`${data.track} ${data.trackCardinalNumber}???`}</Track>
            </ProfileInfo>
          </ProfileInfoBox>
          <ProfileSubBox>
            <SubInfoBox>
              <Category>- ?????????</Category>
              <span>
                {data.position}
              </span>
            </SubInfoBox>
            <SubInfoBox>
              <Category>- ?????? ?????? ???</Category>
              <CarrotBox>
                <FaCarrot />
                <Carrot>{`${data.carrots} ???`}</Carrot>
              </CarrotBox>
            </SubInfoBox>
            <SubInfoBox>
              <Category>- ????????? ??????</Category>
              <GitHubBox href={data.blogAddress}>
                {data.blogAddress}
              </GitHubBox>
            </SubInfoBox>
            <SubInfoBox>
              <Category>- ????????? ????????? ??????</Category>
              <GitHubBox href={data.githubProfileUrl}>
                <AiFillGithub size={22} />
                {data.githubProfileUrl}
              </GitHubBox>
            </SubInfoBox>
          </ProfileSubBox>
        </ProfileBox>
      )}
    </ProfileContainer>
  );
}
