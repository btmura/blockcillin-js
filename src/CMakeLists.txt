#
# Copyright (C) 2013 Brian Muramatsu
#
# This file is part of blockcillin.
#
# blockcillin is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# blockcillin is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
#

add_executable(blockcillin main.cc)

find_package(GLEW REQUIRED)
find_package(OpenGL REQUIRED)

include(FindPkgConfig)
pkg_search_module(SDL2 REQUIRED sdl2)
include_directories(${SDL2_INCLUDE_DIRS})

set(CMAKE_CXX_FLAGS "-std=c++11 -Wall")

add_library(game STATIC game.cc game.h)
add_library(glutil STATIC glutil.cc glutil.h)
add_library(ioutil STATIC ioutil.cc ioutil.h)
add_library(log STATIC log.cc log.h)
add_library(shader STATIC shader.cc shader.h)

target_link_libraries(
    blockcillin
    ${GLEW_LIBRARY}
    ${OPENGL_LIBRARY}
    ${SDL2_LIBRARIES}
    game
    glutil
    ioutil
    log
    shader)

add_executable(blockcillin-tests shader_unittest.cc)

add_test(blockcillin-tests blockcillin-tests)
include_directories(${gtest_SOURCE_DIR}/include ${gtest_SOURCE_DIR})
target_link_libraries(blockcillin-tests gtest gtest_main)
