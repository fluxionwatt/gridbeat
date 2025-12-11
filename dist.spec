%define dist_version %(/usr/lib/rpm/redhat/dist.sh --distnum)
%define tag 1

Name:           gridbeat
Version:        1.0.0
Release:        %{tag}%{?dist}
Summary:        Ready-to-use RTSP, RTMP and HLS server and proxy

License:        Apache License 2.0
URL:            https://www.fluxionwatt.org
Vendor:         fluxionwatt Team
Source1:        %{name}.service
Source3:        %{name}.default
Source5:	    %{name}.yaml

BuildRequires:  git

%global debug_package %{nil}


%description
MediaMTX is a ready-to-use and configurable RTSP/RTMP/HLS server and proxy that allows you to stream media from IP cameras, NVRs, drones and more.

%prep

%build
cd %{current_dir}/frontend && make build

%install

echo "%{version}-"%{tag} > $RPM_BUILD_ROOT/etc/%{name}.version

install -d %{buildroot}/usr/bin
install -m 0755 %{current_dir}/finder %{buildroot}/usr/bin/%{name}

install -d %{buildroot}/etc/%{name}
install -m 0644 %{SOURCE5} %{buildroot}/etc/%{name}/%{name}.yaml

install -d %{buildroot}/usr/lib/systemd/system
install -m 0644 %{SOURCE1} %{buildroot}/usr/lib/systemd/system/%{name}.service

mkdir -p $RPM_BUILD_ROOT/var/lib/%{name}
mkdir -p $RPM_BUILD_ROOT/var/lib/%{name}/conf.d

%clean
rm -rf %{buildroot}/*

%pre

%post
%systemd_post %{name}.service

%preun
%systemd_preun %{name}.service

%postun
%systemd_postun %{name}.service

%files
%{_sysconfdir}/%{name}.version
%dir /etc/%{name}
/usr/bin/%{name}
/etc/%{name}/%{name}.yaml
/usr/lib/systemd/system/%{name}.service

%dir /var/lib/%{name}/conf.d

%changelog
* Sat May 25 2024 Your Name <youremail@example.com> - 1.12.2-1
- Initial version
