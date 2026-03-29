import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination.component";
import type { PaginationMeta } from "../../config/pagination";

const baseMeta = (over: Partial<PaginationMeta> = {}): PaginationMeta => ({
  page: 2,
  limit: 6,
  total: 24,
  totalPages: 4,
  ...over,
});

describe("Pagination", () => {
  it("returns null when only one page", () => {
    const { container } = render(
      <Pagination
        pagination={baseMeta({ totalPages: 1, total: 4 })}
        onPageChange={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when total is 0", () => {
    const { container } = render(
      <Pagination
        pagination={baseMeta({ total: 0, totalPages: 1 })}
        onPageChange={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nav and calls onPageChange when Next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(
      <Pagination pagination={baseMeta()} onPageChange={onPageChange} />,
    );

    expect(screen.getByRole("navigation", { name: /page navigation/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables Previous on first page", () => {
    render(
      <Pagination
        pagination={baseMeta({ page: 1 })}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("disables Next on last page", () => {
    render(
      <Pagination
        pagination={baseMeta({ page: 4, totalPages: 4 })}
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls onPageChange with previous page when Previous clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(
      <Pagination pagination={baseMeta({ page: 2 })} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange when a page number button is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(
      <Pagination pagination={baseMeta({ page: 2 })} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("shows page summary text", () => {
    render(
      <Pagination pagination={baseMeta()} onPageChange={() => {}} />,
    );
    expect(screen.getByText(/page 2 of 4/i)).toBeInTheDocument();
    expect(screen.getByText(/24 posts/i)).toBeInTheDocument();
  });
});
