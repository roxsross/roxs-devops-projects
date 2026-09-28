// Tests de los handlers HTTP

package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHomePage(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rr := httptest.NewRecorder()

	newRouter().ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, http.StatusOK)
	}

	// Just verify the code not html content
	expected := "text/html; charset=utf-8"
	if contentType := rr.Header().Get("Content-Type"); contentType != expected {
		t.Errorf("handler returned unexpected content type: got %v want %v", contentType, expected)
	}
}

func TestStaticPages(t *testing.T) {
	for _, path := range []string{"/courses", "/about", "/contact"} {
		req := httptest.NewRequest(http.MethodGet, path, nil)
		rr := httptest.NewRecorder()

		newRouter().ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("%s returned wrong status code: got %v want %v", path, rr.Code, http.StatusOK)
		}
	}
}

func TestHealthz(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rr := httptest.NewRecorder()

	newRouter().ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("healthz returned wrong status code: got %v want %v", rr.Code, http.StatusOK)
	}
	if body := rr.Body.String(); body != `{"status":"ok"}` {
		t.Errorf("healthz returned unexpected body: %q", body)
	}
}

func TestListenAddrDefaults(t *testing.T) {
	t.Setenv("PORT", "")
	if addr := listenAddr(); addr != "0.0.0.0:8080" {
		t.Errorf("unexpected default addr: %q", addr)
	}

	t.Setenv("PORT", "9090")
	if addr := listenAddr(); addr != "0.0.0.0:9090" {
		t.Errorf("unexpected addr from PORT: %q", addr)
	}
}
