import React from 'react';
import { css } from '@emotion/core';

const startYear = 2020;
const year = new Date().getFullYear();
const discordName = 'Buckyx';
const discordDiscriminator = 5047;
const discordId = 350937395409059842;
const link = `https://discordapp.com/users/${discordId}`;

export const Copyright: React.FC = () => {
  const linkElement = (
    <a
      css={css`
        :visited {
          color: inherit;
        } 
      `}
      target="_blank"
      href={link}
    >
      {discordName} #{discordDiscriminator}
    </a>
  );

  return (
    <div
      css={css`
        position: sticky;
        top: 8px;
        float: right;
      `}
    >
      Copyright &copy; {startYear === year ? year : `${startYear} - ${year}`} | {linkElement}
    </div>
  );
};