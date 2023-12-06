interface HeaderProps {
  artistName: string;
  slug: string;
}

export default function Header({ artistName, slug }: HeaderProps) {
  return <div data-testid='page'>{`My  page: ${slug} ${artistName}`}</div>;
}
