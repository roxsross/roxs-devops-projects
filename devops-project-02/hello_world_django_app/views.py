from django.http import HttpResponse


def hello_world(request):
    # return HttpResponse("<html><body>Hello World</body></html>")
    return HttpResponse("""
        <html>
            <head>
                <style>
                    body {
                        background-color: #f2f2f2;
                        font-family: Arial, sans-serif;
                        color: #333333;
                        text-align: center; /* Center align the text */
                    }
                    h1 {
                        color: #0066cc;
                    }
                    p {
                        font-size: 18px;
                    }
                    img {
                        width: 800px; /* Increase the width of the image */
                        height: auto;
                    }
                    footer {
                        background-color: #f2f2f2;
                        padding: 10px;
                        font-size: 14px;
                        color: #333333;
                    }
                </style>
            </head>
            <body>
                <h1>Hello World by Roxs</h1>
                <p>Welcome to my beautiful Django app!</p>
                <img src="https://roxsross-linktree.s3.amazonaws.com/295-full-website-banner-transparent-black.png" alt="DevOps Image">
                <footer>Bootcamp DevOps by @Roxs</footer> <!-- Add the footer -->
            </body>
        </html>
    """)