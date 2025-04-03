const Footer = () => {
    return (
        <footer className="content-footer footer bg-footer-theme">
            <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
              
              <div className="d-none d-lg-inline-block">
                <a aria-label="go to themeselection license" href="https://themeselection.com/license/" className="footer-link me-4" target="_blank" rel='noreferrer' >License</a>
                <a aria-label="go to themeselection for More Themes" href="https://themeselection.com/" target="_blank" rel='noreferrer' className="footer-link me-4">More Themes</a>

                <a aria-label="go to themeselection Documentation" href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                  target="_blank" rel='noreferrer' className="footer-link me-4">Documentation</a>

                <a aria-label="go to themeselection Support" href="https://github.com/themeselection/sneat-html-admin-template-free/issues" target="_blank" rel='noreferrer'
                  className="footer-link">Support</a>
              </div>
            </div>
          </footer>
      );
}
export default Footer;