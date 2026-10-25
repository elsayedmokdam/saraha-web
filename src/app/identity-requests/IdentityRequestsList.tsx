"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUserCheck } from "react-icons/fi";
import IdentityRequestCard from "@/components/shared/identity-request-card/IdentityRequestCard";
import PaginationStatus from "@/components/shared/pagination-status/PaginationStatus";
import IsEmpty from "@/components/shared/is-empty/IsEmpty";
import {
  getIdentityRequestsAction,
  respondToIdentityRequestAction,
} from "@/services/actions/identity_request.action";
import { IdentityRequest } from "@/services/types/message_interface";
import { notify } from "@/services/utils/helpers/alerts";
import { useAppDispatch } from "@/redux/store/hooks";
import { decrementPending } from "@/redux/store/slices/requestsSlice/RequestsSlice";

interface Props {
  initialRequests: IdentityRequest[];
  initialError?: string;
  limit: number;
}

export default function IdentityRequestsList({ initialRequests, initialError, limit }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [requests, setRequests] = useState(initialRequests);
  const [page, setPage] = useState(1);
  // The API's `meta.totalPages` is computed over the whole collection (not per user): a short page means "last page"
  const [hasMore, setHasMore] = useState(initialRequests.length >= limit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError);
  async function loadMore() {
    setIsLoading(true);
    setError(undefined);
    const res = await getIdentityRequestsAction({ page: String(page + 1), limit: String(limit) });
    setIsLoading(false);
    if (!res.ok) return setError(res.error.message);

    const { data, count } = res.data.data;
    setRequests((prev) => [...prev, ...data]);
    setPage(page + 1);
    setHasMore(count >= limit);
  }

  async function handleRespond(request: IdentityRequest, status: "accepted" | "rejected") {
    const res = await respondToIdentityRequestAction(request._id, status);
    if (!res.ok) return notify.apiError(res.error);

    notify.success(res.data.message);
    dispatch(decrementPending());
    setRequests((prev) =>
      prev.map((r) => (r._id === request._id ? { ...r, status: res.data.data.request.status } : r)),
    );

    if (res.data.data.conversation) {
      router.push(`/conversations/${res.data.data.conversation._id}`);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      {requests.length === 0 && !error ? (
        <IsEmpty
          icon={<FiUserCheck />}
          title="No identity requests"
          description="When someone you wrote to asks who you are, the request appears here."
          links={[{ label: "Go to messages", href: "/messages" }]}
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <IdentityRequestCard
              key={request._id}
              request={request}
              onRespond={handleRespond}
            />
          ))}
          <PaginationStatus
            hasMorePages={hasMore}
            currentPageNum={page}
            isLoading={isLoading}
            hasError={!!error}
            errorMessage={error}
            handleLoadMore={loadMore}
            itemsCount={requests.length}
            noun="requests"
          />
        </div>
      )}
    </section>
  );
}
