;; Quality Verification Contract
;; Records testing and inspection results

(define-data-var last-quality-check-id uint u0)

(define-map quality-checks
  { quality-check-id: uint }
  {
    product-id: uint,
    test-type: (string-utf8 50),
    result: (string-utf8 100),
    passed: bool,
    notes: (string-utf8 200),
    timestamp: uint,
    inspector: principal
  }
)

(define-public (record-quality-check
    (product-id uint)
    (test-type (string-utf8 50))
    (result (string-utf8 100))
    (passed bool)
    (notes (string-utf8 200)))
  (let
    (
      (new-id (+ (var-get last-quality-check-id) u1))
    )
    (var-set last-quality-check-id new-id)
    (map-set quality-checks
      { quality-check-id: new-id }
      {
        product-id: product-id,
        test-type: test-type,
        result: result,
        passed: passed,
        notes: notes,
        timestamp: block-height,
        inspector: tx-sender
      }
    )
    (ok new-id)
  )
)

(define-read-only (get-quality-check (quality-check-id uint))
  (map-get? quality-checks { quality-check-id: quality-check-id })
)

(define-read-only (get-last-quality-check-id)
  (var-get last-quality-check-id)
)
