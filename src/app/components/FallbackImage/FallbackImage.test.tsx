import { fireEvent, render } from '@testing-library/react';
import FallbackImage from './FallbackImage';

describe("FallbackImage", () => {
  it('renders without errors with correct props', () => {
    const altText = 'Test Image';
    const imageUrl = 'http://test.com/test-image.jpg';
    const fallbackImageUrl = 'http://test.com/fallback-image.jpg';

    const { getByAltText } = render(
      <FallbackImage alt={altText} src={imageUrl} fallbackSrc={fallbackImageUrl} />
    );

    const imageElement = getByAltText(altText);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', imageUrl);
  });

  it('uses fallback image when main image fails to load', () => {
    const altText = 'Test Image';
    const mainImageUrl = 'http://test.com/non-existent-image.jpg';
    const fallbackImageUrl = 'http://test.com/fallback-image.jpg';

    const { getByAltText } = render(
      <FallbackImage alt={altText} src={mainImageUrl} fallbackSrc={fallbackImageUrl} />
    );

    const imageElement = getByAltText(altText);
    expect(imageElement).toBeInTheDocument();

    // Simulate the onError event by calling the onError prop manually
    fireEvent.error(imageElement);

    expect(imageElement).toHaveAttribute('src', fallbackImageUrl);
  });
});