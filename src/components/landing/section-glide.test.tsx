import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { GLIDING_ATTRIBUTE, SectionGlide } from './section-glide';

function linkTo(href: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.append(document.createElement('span'));
  link.addEventListener('click', (event) => {
    event.preventDefault();
  });
  document.body.append(link);
  return link;
}

const gliding = (): boolean => document.documentElement.hasAttribute(GLIDING_ATTRIBUTE);

describe('SectionGlide', () => {
  afterEach(() => {
    document.querySelectorAll('a').forEach((link) => {
      link.remove();
    });
    document.documentElement.removeAttribute(GLIDING_ATTRIBUTE);
  });

  it('glides while a link to a section of this page moves it, and lands when it stops', () => {
    const link = linkTo('#ask-claude');
    render(<SectionGlide />);

    fireEvent.click(link.querySelector('span') ?? link);
    expect(gliding()).toBe(true);

    fireEvent(window, new Event('scrollend'));
    expect(gliding()).toBe(false);
  });

  it('leaves the page alone for a link to another page and for a click outside a link', () => {
    const elsewhere = linkTo('/pt-br');
    render(<SectionGlide />);

    fireEvent.click(elsewhere);
    fireEvent.click(document.body);
    fireEvent(document, new Event('click'));

    expect(gliding()).toBe(false);
  });

  it('stops listening and lands when the page goes away mid-glide', () => {
    const link = linkTo('#pricing');
    const { unmount } = render(<SectionGlide />);
    fireEvent.click(link);

    unmount();
    expect(gliding()).toBe(false);
    fireEvent.click(link);

    expect(gliding()).toBe(false);
  });
});
