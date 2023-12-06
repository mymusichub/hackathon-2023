import { render, screen } from "@testing-library/react";
import Header from "./header";

describe("Header", () => {
  it("renders a heading", async () => {
    render(<Header slug='' artistName='' />);

    const page = screen.getByTestId("page");

    expect(page).toBeInTheDocument();
  });
});
